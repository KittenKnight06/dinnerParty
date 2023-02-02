import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeRecipeId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_RECIPE } from '../utils/mutations';

const SavedRecipes = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeRecipe, { error }] = useMutation(REMOVE_RECIPE);
  const userData = data?.me || {};

 
  const handleDeleteRecipe = async (recipeId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeRecipe({
        variables: { recipeId },
      });

      removeRecipeId(recipeId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved recipes!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedRecipes.length
            ? `Viewing ${userData.savedRecipes.length} saved ${userData.savedRecipes.length === 1 ? 'recipe' : 'recipes'}:`
            : 'You have no saved recipes!'}
        </h2>
        <CardColumns>
          {userData.savedRecipes.map((recipe) => {
            return (
              <Card key={recipe.recipeId} border='dark'>
                {recipe.image ? <Card.Img src={recipe.image} alt={`The cover for ${recipe.name}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{recipe.name}</Card.Title>
                  <Card.Text>{recipe.method}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteRecipe(recipe.recipeId)}>
                    Delete this Recipe!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedRecipes;
