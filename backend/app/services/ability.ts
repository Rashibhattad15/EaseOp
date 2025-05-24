// casl/ability.ts
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { UserConfigurationModel } from '../../../commons/models/configurations/userconfiguration'

export const defineAbilitiesFor = (user: UserConfigurationModel) => {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (user.roleId === 'admin') {
    can('manage', 'all');
  } else if (user.roleId === 'editor') {
    can('read', 'Post');
    can('update', 'Post', { authorId: user.uid });
  } else {
    can('read', 'Post');
  }

  return build();
};
