import { List, Datagrid, TextField, Edit, SimpleForm, TextInput } from 'react-admin'

export const HouseholdList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="head_name" />
      <TextField source="contact_phone" />
      <TextField source="location_text" />
    </Datagrid>
  </List>
)

export const HouseholdEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="head_name" />
      <TextInput source="contact_phone" />
      <TextInput source="location_text" />
    </SimpleForm>
  </Edit>
)
