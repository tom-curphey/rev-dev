import React, { Component } from 'react';
import TextInput from '../../utils/input/TextInput';
import SelectInput from '../../utils/input/SelectInput';

class RecipeIngredientForm extends Component {
  componentDidMount() {}

  render() {
    const { recipeIngredients, errors, handleOnChange } = this.props;

    // const options = [
    //   { label: 'Cup', value: 'cup' },
    //   { label: 'Grams', value: 'grams' },
    //   { label: 'Tablespoon', value: 'tablespoon' },
    //   { label: 'Teaspoon', value: 'teaspoon', disabled: 'disabled' }
    // ];

    let formTableRows = recipeIngredients.map(ingredient => {
      const options = [];
      options.push({
        label: 'Select..',
        value: 'no-metric'
        // disabled: 'disabled'
      });
      ingredient.metrics.cup
        ? options.push({ label: 'Cup', value: 'cup' })
        : options.push({
            label: 'Cup',
            value: 'cup',
            disabled: 'disabled'
          });
      options.push({ label: 'Grams', value: 'grams' });
      ingredient.metrics.tablespoon
        ? options.push({
            label: 'Tablespoon',
            value: 'tablespoon'
          })
        : options.push({
            label: 'Tablespoon',
            value: 'tablespoon',
            disabled: 'disabled'
          });
      ingredient.metrics.teaspoon
        ? options.push({ label: 'Teaspoon', value: 'teaspoon' })
        : options.push({
            label: 'Teaspoon',
            value: 'teaspoon',
            disabled: 'disabled'
          });
      ingredient.metrics.whole
        ? options.push({ label: 'Whole', value: 'whole' })
        : options.push({
            label: 'Whole',
            value: 'whole',
            disabled: 'disabled'
          });

      return (
        <li key={ingredient._id}>
          <div>Edit</div>
          <div>{ingredient.displayName}</div>
          <div>
            <TextInput
              value={ingredient.quantity.toString()}
              name="quantity"
              onChange={handleOnChange}
              error={errors.quantity}
              id={ingredient._id}
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
              id={ingredient._id}
            />
          </div>
          <div>{ingredient.grams}</div>
          <div>del</div>
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

export default RecipeIngredientForm;
