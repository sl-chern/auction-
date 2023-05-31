const getFormatedDate = (string) => {
  const date = new Date(string)

  return `${formateValue(date.getDate())}.${formateValue(date.getMonth())}.${formateValue(date.getFullYear())} ${formateValue(date.getHours())}:${formateValue(date.getMinutes())}`
}

const formateValue = (value) => `0${value}`.slice(-2)

export default getFormatedDate