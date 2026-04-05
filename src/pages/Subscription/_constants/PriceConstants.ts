export type DefaultPriceType = {
  Despachos: number;
  Corporativo: number;
  Empresarial: number;
  Pyme: number;
};

export const DEFAULT_PRICE = {
  Pyme: 4_290.0,
  Empresarial: 5_990.0,
  Corporativo: 10_390.0,
  Despachos: 15_690.0,
  ExtraUsers: 1_990.0,
  ADD: 3_990.0,
};

export const RENEWAL_PRICE = {
  Pyme: 3_990.0,
  Empresarial: 5_690.0,
  Corporativo: 9_690.0,
  Despachos: 14_690.0,
  ExtraUsers: 1_890.0,
  ADD: 3_990.0,
};

// const PLANS_IDS = {
//   Trial: "prod_MjDE9ihnCFzJn7",
//   Pyme: "prod_MO0U9eOMqHltxj",
//   Empresarial: "prod_MO0VU7LytUw1Jg",
//   Corporativo: "prod_MO0VPm6HZsxsnB",
//   Despachos: "prod_MO0WIdwwo2xI7U",
//   ExtraUsers: "prod_MO0VF2GRtuuHpw",
//   ADD: "prod_NNha17BGU5gqFC",
//   AltoVolumen: "prod_MOLNApSXbssTjZ",
// };
