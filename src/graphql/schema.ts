import gql from 'graphql-tag';

export const typeDefs = gql`
 enum Role {
   artist
   dj
 }

 type User {
   id: Int!
   first_name: String!
   last_name: String!
   email: String!
   role: Role!
   created_at: String
   updated_at: String
 }

 input CreateUserInput {
   first_name: String!
   last_name: String!
   email: String!
   password:String!
   role: Role
 }

 input UpdateUserProfileInput {
  first_name:String
  last_name: String
  password: String
 }

 type LoginResponse {
  token: String!
  user: User!
 }

 type Query {
   getUser: User
   getAllUsers: [User!]!
 }

 type Mutation {
   createUser(input: CreateUserInput!): User
   login(email: String!, password: String!): LoginResponse!
   updateProfile(input: UpdateUserProfileInput!): User
 }
`;