import {
  Anchor,
  Button,
  Checkbox,
  Group,
  Modal,
  PasswordInput,
  TextInput
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useUpdateEffect } from 'ahooks';
import { pick } from 'lodash';
import './action-handler';

import { useStore, useTrackedState } from './store';
import { useStore as useRegisterModalStore } from '../RegisterModal/store';
import { useUserLogin } from '../../api/hooks/useLogin';
import type { UserLoginFormSchema } from '../../model';
import { userLoginFormSchema } from '../../model';

interface UserLoginProps {}

export type FormSchema = UserLoginFormSchema & {
  rememberPassword: boolean;
};

function UserLoginModal(props: UserLoginProps): JSX.Element {
  const { visible, formValues } = useTrackedState();
  const { setVisible, setFormValues } = useStore.getState();
  const { isLoading: userLoginLoading, mutateAsync: userLoginFetch } = useUserLogin({
    onSuccess: () => {
      setVisible(false);
      if (form.values.rememberPassword) {
        setFormValues(form.values);
      } else {
        setFormValues({
          username: '',
          password: '',
          rememberPassword: false
        });
      }
    }
  });

  const form = useForm<FormSchema>({
    validate: zodResolver(userLoginFormSchema),
    initialValues: { ...formValues }
  });

  useUpdateEffect(() => {
    if (!visible) {
      form.setValues({ ...formValues });
    }
  }, [visible]);

  return (
    <Modal
      opened={visible}
      centered={true}
      onClose={() => setVisible(false)}
      closeOnClickOutside={false}
      title="用户登录"
    >
      <form onSubmit={form.onSubmit(formSubmit)}>
        <TextInput withAsterisk label="用户名" {...form.getInputProps('username')} />
        <PasswordInput withAsterisk label="密码" {...form.getInputProps('password')} />
        <Checkbox
          mt="md"
          label="记住密码"
          color="gray"
          {...form.getInputProps('rememberPassword', { type: 'checkbox' })}
        />

        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={toRegister}
            size="xs"
          >
            没有账户？注册
          </Anchor>
          <Button type="submit" color="gray" loading={userLoginLoading}>
            登录
          </Button>
        </Group>
      </form>
    </Modal>
  );

  async function formSubmit(values: FormSchema) {
    userLoginFetch(pick(values, ['username', 'password']));
  }

  function toRegister() {
    setVisible(false);
    useRegisterModalStore.getState().setVisible(true);
  }
}

export default UserLoginModal;
