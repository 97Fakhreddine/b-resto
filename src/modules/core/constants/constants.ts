export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'saloum',
  signOptions: { expiresIn: '180h' },
};

export interface ListItems {
  items: [];
  total: number;
}
