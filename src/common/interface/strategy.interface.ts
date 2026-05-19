export interface JwtPayloadWithEmail {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}
