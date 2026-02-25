import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IngredientDetailsUI, ModalUI } from '@ui';
import { RootState } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.items
  );

  const ingredient = ingredients.find((item) => item._id === id);

  const handleClose = () => {
    navigate(-1);
  };

  if (!ingredient) {
    return null;
  }

  return (
    <ModalUI title='Детали ингредиента' onClose={handleClose}>
      <IngredientDetailsUI ingredientData={ingredient} />
    </ModalUI>
  );
};
