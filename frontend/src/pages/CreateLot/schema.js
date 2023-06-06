import * as yup from 'yup'

export const getSchema = () => ({
  name: yup.string("Назва повинна бути строкою").required("Назва повинна бути вказаною").min(2, "Назва повинна бути довше 2 букв").max(190, "Назва повинна бути менша ніж 190 букв"),
  image: yup.mixed(),
  condition: yup.object("").required("Стан лоту повинен бути вказаним"),
  description: yup.string("Опис повинен бути строкою").required("Опис повинен бути вказаним"),
  location: yup.string("Місцезнаходження лоту повинно бути строкою").required("Місцезнаходження лоту повинно бути вказаним"),
  category: yup.object("").required("Категорія повинна бути вказаною"),
  subcategory: yup.object("").required("Підкатегорія повинна бути вказаною"),
  startPrice: yup.number().typeError("Початкова ціна повинна бути числом").required("Початкова ціна повинна бути вказаною").min(0, "Початкова ціна повинна бути невід'ємним числом").test('two-digits', "Ціна може містити два знаки після крапки", (val) => /^-?\d+(?:\.\d{1,2})?$/.test(val)),
  betStep: yup.string().test('two-digits', "Початкова ціна повинна бути числом з двома цифрами після крапки", (val) => /^-?\d+(?:\.\d{1,2})?$/.test(val) || val === "" || val === undefined),
  buyNowPrice: yup.string().test('two-digits', "Ціна покупки зараз повинна бути числом з двома цифрами після крапки", (val) => /^-?\d+(?:\.\d{1,2})?$/.test(val) || val === "" || val === undefined),
  minOfferPrice: yup.string().test('two-digits', "Мінімальна ціна пропозиції повинна бути числом з двома цифрами після крапки", (val) => /^-?\d+(?:\.\d{1,2})?$/.test(val) || val === "" || val === undefined),
  autoConfirmOfferPrice: yup.string().test('two-digits', "Ціна автопідтвердження пропозиції повинна бути числом з двома цифрами після крапки", (val) => /^-?\d+(?:\.\d{1,2})?$/.test(val) || val === "" || val === undefined),
  reservePrice: yup.string().test('two-digits', "Резервна ціна повинна бути числом з двома цифрами після крапки", (val) => /^-?\d+(?:\.\d{1,2})?$/.test(val) || val === "" || val === undefined),
  startDate: yup.object().required("Дата початку торгів повинна бути вказаною"),
  endDate: yup.object().required("Дата кінця торгів повинна бути вказаною"),
  shippingPayment: yup.object().required("Людина, що оплачує доставку повинна бути вказаною"),
  dealTypes: yup.array().required("Повинен бути вказаним, хоча б один тип угоди").test('gt 0', 'Повинен бути вказаним, хоча б один тип угоди', val => val.length > 0),
  deliveryTypes: yup.array().required("Повинен бути вказаним, хоча б один тип доставки").test('gt 0', 'Повинен бути вказаним, хоча б один тип доставки', val => val.length > 0),
  paymentTypes: yup.array().required("Повинен бути вказаним, хоча б один тип оплати").test('gt 0', 'Повинен бути вказаним, хоча б один тип оплати', val => val.length > 0)
})