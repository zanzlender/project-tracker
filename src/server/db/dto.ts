import * as ProjectsActions from "./_projects";
import * as UsersActions from "./_users";
import * as ProjectInvitesActions from "./_project_invites";
import * as ProjectTasks from "./_project_tasks";

const dto = {
  ...ProjectsActions,
  ...UsersActions,
  ...ProjectInvitesActions,
  ...ProjectTasks,
};

export default dto;
