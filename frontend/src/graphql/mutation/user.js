import { gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      name
      email
      avatar
      isVerified
    }
  }
`;

const SIGN_UP_MUTATION = gql`
  mutation signUp($user: SignUpInput!) {
    signUp(user: $user) {
      name
      email
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

export { LOGIN_MUTATION, UPDATE_USER_MUTATION,LOGOUT_USER ,SIGN_UP_MUTATION};
