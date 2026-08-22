import { useState } from 'react';
import { X, Copy, Check, Send, Link, Users, Edit3, Eye, Shield } from 'lucide-react';
import { CollaboratorRole, StoredJourney, UserProfile } from '../../types/collaboration';
import { DEMO_USERS, travelStorage } from '../../services/travelStorage';

interface ShareTripModalProps {
  isOpen: boolean;
  trip: StoredJourney;
  currentUser: UserProfile;
  onClose: () => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
  onCollaboratorsUpdated: () => void;
}

export const ShareTripModal = ({
  isOpen,
  trip,
  currentUser,
  onClose,
  onShowToast,
  onCollaboratorsUpdated,
}: ShareTripModalProps) => {
  const [emailOrUser, setEmailOrUser] = useState('');
  const [selectedRole, setSelectedRole] = useState<CollaboratorRole>('Editor');
  const [isSending, setIsSending] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://aethera.travel';
  const shareableUrl = `${currentOrigin}?join=${trip.id}&by=${currentUser.username}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareableUrl);
      }
    } catch {
      // Fallback
    }
    setCopiedLink(true);
    onShowToast('Invite link copied! Share it with your travel companions.', 'success');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUser.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      travelStorage.createInvitation(trip.id, emailOrUser.trim(), selectedRole);

      // Check if this matched a demo user and automatically add them to the trip for instant live demonstration
      const matched = DEMO_USERS.find(
        (u) =>
          u.email.toLowerCase() === emailOrUser.toLowerCase() ||
          u.username.toLowerCase() === emailOrUser.toLowerCase() ||
          u.name.toLowerCase() === emailOrUser.toLowerCase()
      );

      if (matched) {
        travelStorage.addCollaborator(trip.id, {
          userId: matched.id,
          name: matched.name,
          email: matched.email,
          role: selectedRole,
          avatar: matched.avatar,
          initials: matched.initials,
          isOnline: true,
          joinedAt: new Date().toISOString(),
        });
      }

      setIsSending(false);
      const invitedName = matched ? matched.name : emailOrUser;
      setSuccessMessage(`${invitedName} has been invited to collaborate as an ${selectedRole}.`);
      onShowToast(`Invitation sent to ${invitedName}!`, 'success');
      setEmailOrUser('');
      onCollaboratorsUpdated();

      setTimeout(() => setSuccessMessage(null), 4500);
    }, 900);
  };

  const isOwner = trip.ownerId === currentUser.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs animate-fade-rise">
      <div
        className="relative w-full max-w-lg bg-white border border-[#E7E5E2] rounded-[28px] shadow-[0_24px_60px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-7 bg-[#FAF8F5] border-b border-[#E7E5E2] flex items-start justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-mono text-[#6F6F6F] block mb-1">
              SHARED JOURNEY STUDIO
            </span>
            <h3 className="font-instrument text-3xl sm:text-4xl text-[#000000] leading-none">
              Share your journey
            </h3>
            <p className="text-xs sm:text-sm text-[#6F6F6F] font-inter mt-1.5 leading-snug">
              Invite people to collaborate and plan <strong className="text-black font-medium">{trip.title || trip.destination}</strong> together.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[#6F6F6F] hover:text-black hover:bg-neutral-200/60 transition-colors cursor-pointer"
            aria-label="Close share dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Invitation Form */}
          <form onSubmit={handleSendInvite} className="space-y-4">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#6F6F6F]">
              Invite Collaborators
            </label>

            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              {/* Input for Email / Username */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={emailOrUser}
                  onChange={(e) => setEmailOrUser(e.target.value)}
                  placeholder="Enter email or username (e.g. naitri, shubham)..."
                  className="w-full bg-white border border-[#E7E5E2] rounded-full px-4 py-3 text-xs sm:text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  required
                />
              </div>

              {/* Role selector dropdown */}
              <div className="relative sm:w-36">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as CollaboratorRole)}
                  className="w-full bg-[#FAF8F5] border border-[#E7E5E2] rounded-full px-4 py-3 text-xs sm:text-sm font-medium text-black focus:outline-none focus:border-black cursor-pointer appearance-none pr-8"
                >
                  <option value="Editor">Editor (Can edit)</option>
                  <option value="Viewer">Viewer (Can view)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-500">
                  <span className="text-xs">▼</span>
                </div>
              </div>
            </div>

            {/* Quick Suggestions for Demo Personas */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-mono text-neutral-400 mr-1">Suggested:</span>
              {DEMO_USERS.filter((u) => u.id !== currentUser.id && !trip.collaborators.some((c) => c.userId === u.id)).map(
                (persona) => (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => setEmailOrUser(persona.email)}
                    className="text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-2.5 py-0.5 rounded-full transition-colors font-mono cursor-pointer"
                  >
                    +{persona.name}
                  </button>
                )
              )}
            </div>

            {/* Submit button */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="submit"
                disabled={isSending || !emailOrUser.trim()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full px-7 py-3 bg-black text-white text-xs sm:text-sm font-medium hover:bg-neutral-800 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-40 shadow-sm"
              >
                {isSending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending Invitation...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Invitation</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Success banner */}
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2 animate-fade-rise">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Shareable Invite Link Section */}
          <div className="pt-4 border-t border-[#E7E5E2] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-[#6F6F6F] flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5" /> Shareable Invite Link
              </label>
              <span className="text-[11px] text-neutral-400 font-mono">Anyone with link</span>
            </div>

            <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#E7E5E2] rounded-full p-1.5 pl-4">
              <span className="text-xs font-mono text-[#6F6F6F] truncate flex-1 select-all">
                {shareableUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 rounded-full px-4 py-2 bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-all hover:scale-[1.02] cursor-pointer shrink-0 shadow-xs"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* People with Access List */}
          <div className="pt-4 border-t border-[#E7E5E2] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6F6F6F] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> People with Access ({trip.collaborators.length})
              </span>
              <span className="text-[11px] text-neutral-400 font-inter">
                {isOwner ? 'You are the Owner' : 'Shared access'}
              </span>
            </div>

            <div className="divide-y divide-neutral-100 max-h-48 overflow-y-auto pr-1">
              {trip.collaborators.map((c) => (
                <div key={c.userId} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {c.avatar ? (
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#E7E5E2]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-serif">
                        {c.initials}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-inter text-xs font-medium text-black">{c.name}</span>
                        {c.userId === currentUser.id && (
                          <span className="text-[10px] text-[#6F6F6F] font-mono">(You)</span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#6F6F6F] block">{c.email}</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full ${
                      c.role === 'Owner'
                        ? 'bg-black text-white'
                        : c.role === 'Editor'
                        ? 'bg-neutral-100 text-neutral-800 border border-[#E7E5E2]'
                        : 'bg-neutral-50 text-neutral-600 border border-neutral-200'
                    }`}
                  >
                    {c.role === 'Owner' && <Shield className="w-2.5 h-2.5" />}
                    {c.role === 'Editor' && <Edit3 className="w-2.5 h-2.5" />}
                    {c.role === 'Viewer' && <Eye className="w-2.5 h-2.5" />}
                    <span>{c.role}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-[#E7E5E2] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-6 py-2 bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
