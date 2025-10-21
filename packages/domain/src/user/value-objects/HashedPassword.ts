export class HashedPassword {
  private constructor(private readonly value: string) {}

  public static create(hashedValue: string): HashedPassword {
    if (!hashedValue) {
      throw new Error("Hashed password value is required");
    }
    return new HashedPassword(hashedValue);
  }

  public toString(): string {
    return this.value;
  }
}
