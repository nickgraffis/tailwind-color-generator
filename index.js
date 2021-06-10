const plugin = require('tailwindcss/plugin')
const { shade } = require('./logics')

module.exports = function (
  baseName, 
  baseColor, 
  saturationFactor = 1.771968374684816,
  lightFactor = 7.3903743315508015
  ) {
  let module = plugin(function({ theme }) {

  }, {
      theme: {
          extend: {
              colors: theme => (
                Object.assign(
                  {}, 
                  ...shade(baseColor, saturationFactor, lightFactor)
                  .map((color, index) => { 
                    return { [baseName + '-' + (index == 0 ? 50 : index * 100)]: color }
                  })
                )
              )
          }
      }
  })

  return module;
}
