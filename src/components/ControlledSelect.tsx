/* eslint-disable @typescript-eslint/indent */
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { GroupBase, Props as SelectProps, Select } from 'chakra-react-select';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

interface Props<
  FormValues extends FieldValues = FieldValues,
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>
> extends Omit<SelectProps<Option, IsMulti, Group>, 'name' | 'defaultValue'>,
    UseControllerProps<FormValues> {
  label?: string;
}

function ControlledSelect<
  FormValues extends FieldValues = FieldValues,
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  name,
  label,
  options,
  control,
  rules,
  shouldUnregister,
  ...props
}: Props<FormValues, Option, IsMulti, Group>) {
  const {
    field,
    fieldState: { error },
  } = useController<FormValues>({
    name,
    control,
    rules,
    shouldUnregister,
  });

  return (
    <FormControl isInvalid={!!error} id={name} label={label}>
      {label && <FormLabel htmlFor={props.id}>{label}</FormLabel>}
      <Select<Option, IsMulti, Group> options={options} {...props} {...field} />
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
}

export default ControlledSelect;
