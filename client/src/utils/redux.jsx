const redux = {
  auth: {
    isAthenticated: true,
    user: {
      id: '',
      name: '',
      email: '',
      phone: '',
      ingredients: [
        {
          id: 'Ingredient ID',
          packageCost: '',
          packetGrams: '',
          suppierID: 'Ingredient ID'
        }
      ]
    }
  },
  venue: {
    venue: {
      costs: {},
      user: {},
      displayName: '',
      urlName: '',
      email: 'And so on..'
    }
  },
  recipe: {
    baseRecipe: {
      id: '',
      name: '',
      serves: '',
      chefTime: '',
      totalTime: '',
      salesPrice: '',
      internalRecipe: '',
      ingredients: [
        {
          id: 'Ingredient ID',
          amount: '',
          metric: ''
        }
      ]
    },
    comparedRecipes: [
      {
        name: '',
        ingredients: [
          {
            id: '',
            amount: '',
            metric: ''
          }
        ]
      }
    ]
  },
  ingredients: {
    id: '',
    name: '',
    metrics: {
      cup: '',
      whole: '...'
    },
    metric: [name],
    suppliers: [
      {
        id: 'Supplier ID',
        packageCost: '',
        packageGrams: '',
        metrics: {
          cup: '',
          whole: '...'
        }
      }
    ]
  },
  suppliers: {
    id: '',
    name: '',
    email: '',
    mobile: '',
    address: '',
    authorised: true // This is if the supplier is confirmed by Recipe Revenue or created by a user
  },
  metrics: {
    id: '',
    name: '',
    grams: ''
  }
};
