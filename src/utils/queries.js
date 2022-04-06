import { gql } from "@apollo/client";

const GET_DAILIES = gql`
  query dailies {
    dailies(order_by: { date: desc }) {
      id
      date
    }
  }
`;

const GET_DAILY = gql`
  query getDailies($id: uuid!) {
    dailies(where: { id: { _eq: $id } }) {
      id
      date
      content
    }
  }
`;

const GET_PREVIOUS_DAILY = gql`
  query getPreviousDaily($date: date!) {
    dailies(order_by: {date: desc}, where: { date: { _lt: $date } }, limit: 1) {
      id
      date
      content
    }
  }
`;

const INSERT_DAILY = gql`
  mutation insertDailiesOne($content: String!) {
    insert_dailies_one(object: { content: $content }) {
      id
      content
      date
    }
  }
`;

const UPDATE_DAILY = gql`
  mutation updateDailies(
    $id: uuid!
    $content: String!
    $dateUpdated: timestamptz!
  ) {
    update_dailies_by_pk(
      pk_columns: { id: $id }
      _set: { date_updated: $dateUpdated, content: $content }
    ) {
      id
      content
    }
  }
`;

const queries = {
  GET_DAILY,
  GET_PREVIOUS_DAILY,
  GET_DAILIES,
  INSERT_DAILY,
  UPDATE_DAILY,
};
export default queries;
