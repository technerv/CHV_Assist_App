import { List, Datagrid, TextField, Edit, SimpleForm, TextInput, SelectInput, ReferenceInput } from 'react-admin'

export const MemberList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="sex" />
      <TextField source="household" />
    </Datagrid>
  </List>
)

export const MemberEdit = () => (
  <Edit>
    <SimpleForm>
      <ReferenceInput source="household" reference="households">
        <SelectInput optionText="head_name" />
      </ReferenceInput>
      <TextInput source="name" />
      <SelectInput source="sex" choices={[
        { id: 'M', name: 'M' },
        { id: 'F', name: 'F' },
        { id: 'O', name: 'O' },
      ]} />
    </SimpleForm>
  </Edit>
)
