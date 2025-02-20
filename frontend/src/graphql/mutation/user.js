import { gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      name
      email
      avatar
    }
  }
`;



const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($userInput: UpdateUserInput!) {
    updateUser(userInput: $userInput) {
      success
      message
      user {
        id
        name
        email
      }
    }
  }
`;

const LOGOUT_USER = gql`
  mutation Mutation{
    logout  
  }
`

export { LOGIN_MUTATION, UPDATE_USER_MUTATION,LOGOUT_USER };
