useEffect(() => {
  let interval

  console.log(pageLoaded)

  if(pageLoaded) {
    interval = setTimeout(() => {
      const newSearchParams = {}

      for (const key in selectedFilters) {
        if(selectedFilters[key] !== null && selectedFilters[key] !== '' && !(selectedFilters[key] instanceof Object)) {
          newSearchParams[key] = selectedFilters[key]
        }
        else if(selectedFilters[key] !== null && selectedFilters[key] instanceof Object && !(selectedFilters[key] instanceof Array)) {
          if(!!selectedFilters[key].value) {
            newSearchParams[key] = selectedFilters[key].value
          }
          else if(!!selectedFilters[key].min || !!selectedFilters[key].max) {
            if(!!selectedFilters[key].min)
              newSearchParams.minprice = selectedFilters[key].min
            if(!!selectedFilters[key].max)
              newSearchParams.maxprice = selectedFilters[key].max
          }
          else {
            for(const innerKey in selectedFilters[key]) {
              if(selectedFilters[key][innerKey] instanceof Array) 
                newSearchParams[`feature_${innerKey}`] = selectedFilters[key][innerKey].map(item => item.value)
              else if(selectedFilters[key][innerKey] instanceof Object) {
                const valueArray = Object.keys(selectedFilters[key][innerKey]).filter(item => selectedFilters[key][innerKey][item])
                newSearchParams[`feature_${innerKey}`] = valueArray
              }
            }
          }
        }
        else if(selectedFilters[key] !== null && selectedFilters[key] instanceof Array) {
          newSearchParams[key] = selectedFilters[key].map(item => item.value)
        }
      }

      setSearchParams(newSearchParams)
    }, 1000)
  }
  
  return () => clearTimeout(interval)
}, [selectedFilters, pageLoaded])

useEffect(() => {
  console.log();
  if(!!features && !pageLoaded) {
    const filtersFromSearchParams = {
      name: '',
      price: {
        min: '',
        max: ''
      },
      newFor: null,
      endingIn: null,
      dealTypes: null,
      deliveryTypes: null,
      paymentTypes: null,
      offers: null,
      sort: null,
      desc: true,
      category: null,
      subcategory: null,
      features: {}
    }

    for (const [key, value] of searchParams.entries()) {
      if(key.search('feature') >= 0) {
        const featureId = key.slice(8)

        const feature = features.features.filter(item => item.id === featureId)

        if(feature.isOptions) {
          const featureValue = feature.featureOptions.map(item => ({value: item.id, label: item.value})).filter(item => item.value === value)
          filtersFromSearchParams.features[featureId].push(featureValue)
        }
      }
      else if(key === 'minprice') {
        filtersFromSearchParams.price.min = value
      }
      else if(key === 'maxprice') {
        filtersFromSearchParams.price.max = value
      }
      else {
        filtersFromSearchParams[key] = value
      }
      console.log(`${key}, ${value}`);
    }

    setSelectedFilters(filtersFromSearchParams)

    setPageLoaded(true)
  }
}, [features, pageLoaded])