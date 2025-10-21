export class EmailAddress {
  private constructor(private readonly value: string) {
    if (!EmailAddress.isValid(value)) {
      throw new Error("Invalid email address");
    }
  }

  public static create(email: string): EmailAddress {
    return new EmailAddress(email.toLowerCase());
  }

  private static isValid(email: string): boolean {
    // Implement basic email validation regex.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public toString(): string {
    return this.value;
  }
}
