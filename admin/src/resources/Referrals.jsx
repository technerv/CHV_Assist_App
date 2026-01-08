import { List, Datagrid, TextField, Edit, SimpleForm, TextInput, SelectInput, ReferenceInput, DateField, TopToolbar, ExportButton, TextInput as RATextInput } from 'react-admin'

const ReferralFilters = [
  <SelectInput source="priority" choices={[
    { id: 'normal', name: 'normal' },
    { id: 'urgent', name: 'urgent' },
  ]} alwaysOn />,
  <SelectInput source="status" choices={[
    { id: 'pending', name: 'pending' },
    { id: 'completed', name: 'completed' },
    { id: 'cancelled', name: 'cancelled' },
  ]} alwaysOn />,
  <RATextInput source="reason" label="Reason contains" alwaysOn />,
]

const ReferralActions = () => (
  <TopToolbar>
    <ExportButton />
  </TopToolbar>
)

export const ReferralList = () => (
  <List filters={ReferralFilters} actions={<ReferralActions />}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="member" />
      <TextField source="facility" />
      <TextField source="priority" />
      <TextField source="status" />
      <TextField source="reason" />
      <DateField source="created_at" />
      <DateField source="completed_at" />
    </Datagrid>
  </List>
)

export const ReferralEdit = () => (
  <Edit>
    <SimpleForm>
      <ReferenceInput source="member" reference="members">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ReferenceInput source="facility" reference="facilities">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <SelectInput source="priority" choices={[
        { id: 'normal', name: 'normal' },
        { id: 'urgent', name: 'urgent' },
      ]} />
      <SelectInput source="status" choices={[
        { id: 'pending', name: 'pending' },
        { id: 'completed', name: 'completed' },
        { id: 'cancelled', name: 'cancelled' },
      ]} />
      <TextInput source="reason" multiline />
    </SimpleForm>
  </Edit>
)
