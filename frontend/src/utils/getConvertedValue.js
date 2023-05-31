const getConvertedValue = (value, unit) => {
  let convertedValue
  let divisionAmount = 0

  const weightUnits = ['г', 'кг', 'т']
  const lengthUnits = ['мм', 'м', 'км']

  if(unit === 'г' || unit === 'мм') {
    convertedValue = parseFloat(value)
    while(convertedValue / 1000 >= 1) {
      convertedValue /= 1000
      divisionAmount ++
    }
    convertedValue = `${convertedValue.toFixed(2)}${unit === 'г' ? weightUnits[divisionAmount] : unit === 'мм' ? lengthUnits[divisionAmount] : ''}`

  }
  else
    convertedValue = `${value}${unit.replace('\\', '')}`
  
  return convertedValue
}

export default getConvertedValue