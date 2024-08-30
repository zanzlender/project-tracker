import * as ProjectsActions from "./_projects";
import * as UsersActions from "./_users";
import * as ProjectInvitesActions from "./_project_invites";

const dto = {
  ...ProjectsActions,
  ...UsersActions,
  ...ProjectInvitesActions,
};

export default dto;
