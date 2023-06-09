const textByNumber = (number, type) => {
    let text
  
    number = +number.toFixed(0)
  
    switch(type) {
      case 'year':
  
        switch(number) {
          case 1: 
            text = `1 рік`
            break
          case 2:
          case 3:
          case 4:
            text = `${number} роки`
            break
          default :
            text = `${number} років`
            break
        }
  
        break 
      
      case 'month':
  
        switch(number) {
          case 1: 
            text = `1 місяць`
            break
          case 2:
          case 3:
          case 4:
            text = `${number} місяці`
            break
          default :
            text = `${number} месяців`
            break
        }
  
        break 
      case 'day':
  
        if(number === 1 || number === 21)
          text = `${number} день`
        else if((number >= 2 && number <= 4) || (number >= 22 && number <= 24))
          text = `${number} дні`
        else
          text = `${number} днів`
        
        break 
      case 'hour':
  
        if((number % 10 === 2 || number % 10 === 3 || number % 10 === 4) && (number > 20 || number < 10))
          text = `${number} години`
        else if((number % 10 === 1) && (number > 20 || number < 10))
          text = `${number} година`
        else
          text = `${number} годин`
  
        break 
      case 'minute':
  
        if((number % 10 === 2 || number % 10 === 3 || number % 10 === 4) && (number > 20 || number < 10))
          text = `${number} хвилини`
        else if((number % 10 === 1) && (number > 20 || number < 10))
          text = `${number} хвилина`
        else
          text = `${number} хвилин`
  
        break 
      
      default :
        break
    }
  
    return text
  }
  
  const getStringDate = (someDate) => {
    const crD = new Date(someDate)
    const now = new Date(Date.now())
  
    let diff = (crD.getTime() - now.getTime()) / (1000 * 60)
    
    if(diff < 0)
      return 'торги закінчились'
    if(diff < 1)
      return `менше хвилини`
    else if(diff < 60)
      return textByNumber(diff, 'minute')
    else {
      diff /= 60
  
      if(diff < 24)
        return textByNumber(diff, 'hour')
      
      else {
        diff /= 24
    
        if(diff < 30)
          return textByNumber(diff, 'day')
        
        else {
          diff /= 30
      
          if(diff < 12)
            return textByNumber(diff, 'month')
          
          else {
            diff /= 12
          
            return textByNumber(diff, 'year')
          }
        }
      }
    }
  }
  
  export default getStringDate