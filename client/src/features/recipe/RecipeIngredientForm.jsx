import React, { Component } from 'react';
import TextInput from '../../utils/input/TextInput';
import SelectInput from '../../utils/input/SelectInput';
import roundNumber from '../../utils/functions/roundNumber';
import PropTypes from 'prop-types';

class RecipeIngredientForm extends Component {
  componentDidMount() {}

  render() {
    const {
      recipeIngredients,
      errors,
      handleOnChange,
      handleDeleteRecipeIngredient
    } = this.props;

    console.log('recipeIngredients', recipeIngredients);

    let formTableRows = recipeIngredients.map((ingredient, i) => {
      console.log('INGREDIENT', ingredient);

      const options = [];
      // options.push({
      //   label: 'Select..',
      //   value: 'no-metric'
      //   // disabled: 'disabled'
      // });

      ingredient.ingredient.metrics.cup
        ? options.push({ label: 'Cup', value: 'cup' })
        : options.push({
            label: 'Cup',
            value: 'cup',
            disabled: 'disabled'
          });
      options.push({ label: 'Grams', value: 'grams' });
      ingredient.ingredient.metrics.tablespoon
        ? options.push({
            label: 'Tablespoon',
            value: 'tablespoon'
          })
        : options.push({
            label: 'Tablespoon',
            value: 'tablespoon',
            disabled: 'disabled'
          });
      ingredient.ingredient.metrics.teaspoon
        ? options.push({ label: 'Teaspoon', value: 'teaspoon' })
        : options.push({
            label: 'Teaspoon',
            value: 'teaspoon',
            disabled: 'disabled'
          });
      ingredient.ingredient.metrics.whole
        ? options.push({ label: 'Whole', value: 'whole' })
        : options.push({
            label: 'Whole',
            value: 'whole',
            disabled: 'disabled'
          });

      return (
        <li key={i}>
          <div>i </div>
          <div>
            {ingredient.ingredient.displayName}
            <span style={{ color: 'red' }}>
              {' '}
              {ingredient.quantity
                ? ''
                : ingredient.new
                ? ''
                : 'Error ->'}
            </span>
          </div>
          <div>
            <TextInput
              value={
                ingredient.quantity
                  ? ingredient.quantity.toString()
                  : ''
              }
              name="quantity"
              onChange={handleOnChange}
              error={errors.quantity}
              id={i}
              style={{ width: '50px' }}
            />
          </div>
          <div>
            <SelectInput
              // info="Is this recipe made internally to be added to other recipes?"
              name="metric"
              options={options}
              value={ingredient.metric}
              onChange={handleOnChange}
              error={errors.metric}
              id={ingredient.ingredient._id}
            />
          </div>
          <div>
            {ingredient.grams && roundNumber(ingredient.grams, 2)}
          </div>
          <div
            style={{ cursor: 'pointer' }}
            onClick={handleDeleteRecipeIngredient(i)}
          >
            x
          </div>
        </li>
      );
    });

    return (
      <section className="recipeIngredientForm">
        <ul>{formTableRows}</ul>
      </section>
    );
  }
}

RecipeIngredientForm.propTypes = {
  recipeIngredients: PropTypes.array,
  errors: PropTypes.object,
  handleOnChange: PropTypes.func.isRequired,
  handleDeleteRecipeIngredient: PropTypes.func.isRequired
};

export default RecipeIngredientForm;
