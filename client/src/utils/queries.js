import { gql } from '@apollo/client';

export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      recipeCount
      savedRecipes {
        recipeId
        description
        name
        image
        link
      }
    }
  }
`;