import { IUser } from "@repo/shared/types";
import { EmailAddress } from "../value-objects/EmailAddress.js";
import { HashedPassword } from "../value-objects/HashedPassword.js";

/**
 * Agregado raíz de Usuario.
 * Encapsula las reglas de negocio y los invariantes del usuario.
 */
export class User {
  /**
   * Constructor privado para forzar la creación mediante métodos de fábrica.
   * @param userProps - Objeto de transferencia de datos completo del usuario.
   */
  constructor(private userProps: IUser) {}

  /**
   * Método de fábrica que crea una nueva instancia de User a partir de datos en bruto.
   * Aplica valores por defecto para campos opcionales.
   *
   * @param data - Objeto de transferencia de datos del usuario.
   * @returns Nueva instancia de User.
   *
   * @example
   * const user = User.craete({
   *   uuid: '123e4567-e89b-12d3-a456-426614174000',
   *   passwordHash: '$2b$10$...',
   *   profile: { username: 'johndoe', email: 'john@example.com' },
   *   settings: { isVerified: true }
   * });
   */
  public static craete(data: IUser): User {
    return new User({
      uuid: data.uuid,
      passwordHash: HashedPassword.create(data.passwordHash).toString(),
      profile: {
        username: data.profile.username,
        email: EmailAddress.create(data.profile.email).toString(),
        friends: data.profile.friends || [],
      },
      settings: {
        isVerified: data.settings.isVerified || false,
        isActive: data.settings.isActive || true,
      },
    });
  }

  /**
   * Reconstituye una instancia de User a partir de datos de la capa de persistencia.
   * Asume que los datos ya son válidos y completos.
   *
   * @param props - Datos del usuario tal como se almacenan en la base de datos.
   * @returns Instancia de User que refleja el estado persistido.
   */
  public static fromPersistence(props: IUser): User {
    return new User(props);
  }

  /**
   * Devuelve una copia inmutable de las propiedades del usuario.
   * Útil para acceso de solo lectura y evitar mutaciones externas.
   *
   * @returns Copia profunda del objeto de transferencia de datos del usuario.
   */
  public getProps(): IUser {
    return { ...this.userProps };
  }

  /**
   * Actualiza parcialmente las propiedades del usuario.
   * Combina en profundidad los objetos anidados de perfil y configuración.
   *
   * @param newProps - Datos parciales del usuario a fusionar.
   *
   * @example
   * user.updateProps({
   *   profile: { email: 'new@example.com' },
   *   settings: { isVerified: true }
   * });
   */
  public updateProps(newProps: Partial<IUser>): void {
    this.userProps = {
      ...this.userProps,
      ...newProps,
      profile: {
        ...this.userProps.profile,
        ...(newProps.profile || {}),
      },
      settings: {
        ...this.userProps.settings,
        ...(newProps.settings || {}),
      },
    };
  }
}
