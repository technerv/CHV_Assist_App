import { List, Datagrid, TextField, NumberField, Edit, SimpleForm, TextInput, ArrayInput, SimpleFormIterator } from 'react-admin'

export const FacilityList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="type" />
      <TextField source="phone" />
      <TextField source="address" />
      <NumberField source="latitude" />
      <NumberField source="longitude" />
    </Datagrid>
  </List>
)

export const FacilityEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="type" />
      <ArrayInput source="services">
        <SimpleFormIterator>
          <TextInput />
        </SimpleFormIterator>
      </ArrayInput>
      <TextInput source="phone" />
      <TextInput source="address" />
      <TextInput source="latitude" />
      <TextInput source="longitude" />
    </SimpleForm>
  </Edit>
)
