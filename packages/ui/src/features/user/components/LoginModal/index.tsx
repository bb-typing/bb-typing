import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  Group,
  Modal,
  PasswordInput,
  TextInput
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { APIResponse } from '@ui/core/axios/types';
import { useUpdateEffect } from 'ahooks';
import { pick } from 'lodash';
import { useUserLoginAPI } from '../../api/hooks/useUserLogin';
import { UserLoginFormSchema, userLoginFormSchema } from '../../model';
import './action-handler';

import { useStore, useTrackedState } from './store';

interface UserLoginProps {}

export type FormSchema = UserLoginFormSchema & {
  rememberPassword: boolean;
};

function UserLoginModal(props: UserLoginProps): JSX.Element {
  const { visible, formValues } = useTrackedState();
  const { setVisible, setFormValues } = useStore.getState();
  const { isLoading: userLoginLoading, mutateAsync: userLoginFetch } = useUserLoginAPI({
    onSuccess: () => {
      showNotification({
        title: '登录成功',
        message: '欢迎回来',
        color: 'green'
      });
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
    },
    onError(_error, variables, context) {
      const error = _error as APIResponse;
      if (error.code === 20001) {
        showNotification({
          title: '登录失败',
          message: '用户名或密码错误',
          color: 'red'
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
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
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
            onClick={() => {}}
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

  async function handleFormSubmit(values: FormSchema) {
    userLoginFetch(pick(values, ['username', 'password']));
  }
}

export default UserLoginModal;
