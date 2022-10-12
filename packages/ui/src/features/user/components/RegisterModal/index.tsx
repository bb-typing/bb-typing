import {
  Alert,
  Anchor,
  Box,
  Button,
  Center,
  Checkbox,
  Group,
  Modal,
  PasswordInput,
  TextInput
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { APIResponse } from '../../../../core/request/types';
import { useUpdateEffect } from 'ahooks';
import { pick } from 'lodash';
import { SVGProps } from 'react';
import { useUserRegisterAPI } from '../../api/hooks/useRegister';
import { UserRegisterFormSchema, userRegisterFormSchema } from '../../model';
import './action-handler';

import { useStore, useTrackedState } from './store';
import { useStore as useLoginModalStore } from '../LoginModal/store';

interface UserRegisterProps {}

export type FormSchema = UserRegisterFormSchema & {};

export function IcoTwotoneKeyboardArrowLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6l6 6l1.41-1.41z"
      ></path>
    </svg>
  );
}

export function MaterialSymbolsCheckCircleOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="m10.6 16.6l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-2q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 4 12 4Q8.65 4 6.325 6.325Q4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Zm0-8Z"
      ></path>
    </svg>
  );
}
function UserRegisterModal(props: UserRegisterProps): JSX.Element {
  const { visible } = useTrackedState();
  const { setVisible } = useStore.getState();
  const { isLoading: userRegisterLoading, mutateAsync: userRegisterFetch } =
    useUserRegisterAPI({
      onSuccess: () => {
        showNotification({
          title: '注册成功',
          message: '欢迎加入',
          color: 'green'
        });
        setVisible(false);
      },
      onError(_error) {
        const error = _error as APIResponse;
        // TODO: error-code 待完善
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
    validate: zodResolver(userRegisterFormSchema),
    initialValues: {
      username: '',
      password: ''
    }
  });

  useUpdateEffect(() => {
    if (!visible) {
      form.reset();
    }
  }, [visible]);

  return (
    <Modal
      opened={visible}
      centered={true}
      onClose={() => setVisible(false)}
      closeOnClickOutside={false}
      title="用户注册"
    >
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <TextInput withAsterisk label="用户名" {...form.getInputProps('username')} />
        <PasswordInput withAsterisk label="密码" {...form.getInputProps('password')} />

        {/* <Alert
          mt={20}
          color="green"
          icon={<MaterialSymbolsCheckCircleOutline fontSize={16} />}
        >
          注册成功
        </Alert> */}
        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={handleBackLogin}
            size="xs"
          >
            <Center inline>
              <IcoTwotoneKeyboardArrowLeft fontSize={12} />
              <Box ml={5}>回到登录</Box>
            </Center>
          </Anchor>
          <Button type="submit" color="gray" loading={userRegisterLoading}>
            注册
          </Button>
        </Group>
      </form>
    </Modal>
  );

  async function handleFormSubmit(values: FormSchema) {
    userRegisterFetch(pick(values, ['username', 'password']));
  }

  function handleBackLogin() {
    setVisible(false);
    useLoginModalStore.getState().setVisible(true);
  }
}

export default UserRegisterModal;
