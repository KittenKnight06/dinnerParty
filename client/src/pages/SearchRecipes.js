import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';
import Auth from '../utils/auth';
import { saveRecipeIds, getSavedRecipeIds } from '../utils/localStorage';
import { useMutation } from '@apollo/client';
import { SAVE_RECIPE } from '../utils/mutations';

const SearchRecipes = () => {
  const [searchedRecipes, setSearchedRecipes] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedRecipeIds, setSavedRecipeIds] = useState(getSavedRecipeIds());

  const [saveRecipe, { error }] = useMutation(SAVE_RECIPE);

  useEffect(() => {
    return () => saveRecipeIds(savedRecipeIds);
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    function recipeData () {
      var recipeURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`;

      return fetch (recipeURL)
      .then(function(response){
        return response.json()
      })
    }

    // try {
    //   const response = await fetch(
    //     `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`
    //   );

    //   if (!response.ok) {
    //     throw new Error('Something went wrong!');
    //   }

    //   const {items} = await response.json();
      
    //   const recipeData = items.map((recipe) => ({
    //     recipeId: recipe.idMeal,
    //     name: recipe.strMeal,
    //     ingredient: recipe.strIngredient,
    //     measure: recipe.strMeasure,
    //     method: recipe.strInstructions,
    //     image: recipe.strMealThumb || '',
    //   }));
 
    //   setSearchedRecipes(recipeData);
    //   setSearchInput('');
    // } catch (err) {
    //   console.error(err);
    // }
  }


  const handleSaveRecipe = async (recipeId) => {
    const recipeToSave = searchedRecipes.find((recipe) => recipe.recipeId === recipeId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveRecipe({
        variables: { newRecipe: { ...recipeToSave } },
      });

      setSavedRecipeIds([...savedRecipeIds, recipeToSave.recipeId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-success'>
        <Container>
          <h1>Search for Recipes!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a recipe'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='primary' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedRecipes.length
            ? `Viewing ${searchedRecipes.length} results:`
            : 'Search for a recipe to begin'}
        </h2>
        <CardColumns>
          {searchedRecipes.map((recipe) => {
            return (
              <Card key={recipe.recipeId} border='dark'>
                {recipe.image ? (
                  <Card.Img src={recipe.image} alt={`The cover for ${recipe.name}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{recipe.name}</Card.Title>
                  <Card.Text>{recipe.method}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedRecipeIds?.some((savedRecipeId) => savedRecipeId === recipe.recipeId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveRecipe(recipe.recipeId)}>
                      {savedRecipeIds?.some((savedRecipeId) => savedRecipeId === recipe.recipeId)
                        ? 'This recipe has already been saved!'
                        : 'Save this Recipe!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchRecipes;
