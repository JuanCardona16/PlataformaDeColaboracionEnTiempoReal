export class OnlineUsersManager {
  private users = new Map<string, Set<string>>();

  add(userId: string, socketId: string) {
    const set = this.users.get(userId) ?? new Set<string>();
    set.add(socketId);
    this.users.set(userId, set);
  }

  remove(userId: string, socketId: string) {
    const set = this.users.get(userId);
    if (!set) return;
    set.delete(socketId);
    if (set.size === 0) this.users.delete(userId);
    else this.users.set(userId, set);
  }

  getSockets(userId: string): string[] {
    return Array.from(this.users.get(userId) ?? []);
  }

  listOnlineUsers(): string[] {
    return Array.from(this.users.keys());
  }
}
