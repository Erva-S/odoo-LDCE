import { useState } from 'react';
import { Collaborator, CollaboratorRole, UserProfile } from '../../types/collaboration';
import { UserPlus, MoreHorizontal, Shield, Edit3, Eye, Trash2, Check, Sparkles } from 'lucide-react';

interface CollaboratorsListProps {
  collaborators: Collaborator[];
  currentUser: UserProfile;
  isOwner: boolean;
  canEdit: boolean;
  onInviteClick: () => void;
  onUpdateRole?: (userId: string, newRole: CollaboratorRole) => void;
  onRequestRemove?: (collaborator: Collaborator) => void;
}

export const CollaboratorsList = ({
  collaborators,
  currentUser,
  isOwner,
  onInviteClick,
  onUpdateRole,
  onRequestRemove,
}: CollaboratorsListProps) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const getRoleBadgeStyle = (role: CollaboratorRole) => {
    switch (role) {
      case 'Owner':
        return 'bg-black text-white font-medium';
      case 'Editor':
        return 'bg-neutral-100 text-neutral-900 border border-[#E7E5E2] font-medium';
      case 'Viewer':
        return 'bg-neutral-50 text-neutral-600 border border-neutral-200';
    }
  };

  const getRoleIcon = (role: CollaboratorRole) => {
    switch (role) {
      case 'Owner':
        return <Shield className="w-3 h-3 text-neutral-300" />;
      case 'Editor':
        return <Edit3 className="w-3 h-3 text-neutral-600" />;
      case 'Viewer':
        return <Eye className="w-3 h-3 text-neutral-500" />;
    }
  };

  if (collaborators.length === 0) {
    return (
      <div className="bg-[#FAF8F5] border border-[#E7E5E2] rounded-2xl p-8 text-center animate-fade-rise">
        <div className="w-12 h-12 rounded-full bg-white border border-[#E7E5E2] flex items-center justify-center mx-auto mb-4 text-black shadow-xs">
          <Sparkles className="w-5 h-5 text-neutral-800" />
        </div>
        <h4 className="font-instrument text-2xl text-[#000000] mb-1.5">
          Travel is better together.
        </h4>
        <p className="text-xs sm:text-sm text-[#6F6F6F] font-inter max-w-sm mx-auto mb-6 leading-relaxed">
          Invite friends or travel companions to help shape, refine, and budget this journey together.
        </p>
        <button
          type="button"
          onClick={onInviteClick}
          className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 bg-[#000000] text-white text-xs font-medium hover:bg-neutral-800 transition-all hover:scale-[1.02] cursor-pointer shadow-sm"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>+ Invite Collaborator</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E7E5E2]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#6F6F6F]">
            PEOPLE WITH ACCESS
          </span>
          <span className="text-[11px] font-mono bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-full">
            {collaborators.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onInviteClick}
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-[#000000] text-white text-xs font-medium hover:bg-neutral-800 transition-all hover:scale-[1.02] cursor-pointer shadow-xs"
        >
          <UserPlus className="w-3 h-3" />
          <span>+ Invite</span>
        </button>
      </div>

      {/* Collaborator rows */}
      <div className="divide-y divide-neutral-100">
        {collaborators.map((c) => {
          const isCurrentUser = c.userId === currentUser.id;
          const isTripOwnerRow = c.role === 'Owner';
          const canManageThisUser = isOwner && !isTripOwnerRow;
          const isMenuOpen = openDropdownId === c.userId;

          return (
            <div
              key={c.userId || c.email}
              className="py-3 sm:py-3.5 flex items-center justify-between gap-3 group hover:bg-[#FAF8F5]/60 px-2 rounded-xl transition-colors relative"
            >
              {/* Left: Avatar + Name + Online indicator */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  {c.avatar ? (
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#E7E5E2]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-serif">
                      {c.initials || c.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  {/* Active / Online pulse */}
                  {c.isOnline && (
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"
                      title="Currently active"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-inter text-sm font-medium text-[#000000] truncate">
                      {c.name}
                    </span>
                    {isCurrentUser && (
                      <span className="text-[10px] font-mono text-[#6F6F6F] bg-neutral-100 px-1.5 py-0.2 rounded">
                        You
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#6F6F6F] font-inter truncate block">
                    {c.email}
                  </span>
                </div>
              </div>

              {/* Right: Role badge + Owner 3-dot menu */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full ${getRoleBadgeStyle(
                    c.role
                  )}`}
                >
                  {getRoleIcon(c.role)}
                  <span>{c.role}</span>
                </span>

                {/* 3-dot management button for Owner */}
                {canManageThisUser && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdownId(isMenuOpen ? null : c.userId)}
                      className="p-1.5 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-200/70 transition-colors cursor-pointer"
                      title="Manage collaborator"
                      aria-label="Manage collaborator"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-[#E7E5E2] rounded-2xl shadow-xl p-1.5 z-30 animate-fade-rise text-xs font-inter">
                        <span className="block px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#6F6F6F] border-b border-neutral-100">
                          Change Role
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            if (onUpdateRole) onUpdateRole(c.userId, 'Editor');
                            setOpenDropdownId(null);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                            c.role === 'Editor'
                              ? 'bg-neutral-100 font-medium text-black'
                              : 'text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
                            <div>
                              <span>Editor</span>
                              <span className="block text-[10px] text-[#6F6F6F]">Can edit trip</span>
                            </div>
                          </div>
                          {c.role === 'Editor' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (onUpdateRole) onUpdateRole(c.userId, 'Viewer');
                            setOpenDropdownId(null);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                            c.role === 'Viewer'
                              ? 'bg-neutral-100 font-medium text-black'
                              : 'text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Eye className="w-3.5 h-3.5 text-neutral-500" />
                            <div>
                              <span>Viewer</span>
                              <span className="block text-[10px] text-[#6F6F6F]">Read-only access</span>
                            </div>
                          </div>
                          {c.role === 'Viewer' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>

                        <div className="my-1 border-t border-neutral-100" />

                        <button
                          type="button"
                          onClick={() => {
                            setOpenDropdownId(null);
                            if (onRequestRemove) onRequestRemove(c);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove access</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
