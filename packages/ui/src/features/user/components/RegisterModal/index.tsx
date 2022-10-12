import {
  Alert,
  Anchor,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  PasswordInput,
  TextInput
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import {
  IcoTwotoneKeyboardArrowLeft,
  MaterialSymbolsCheckCircleOutline
} from '@ui/components/Icons';
import { useSetState, useUpdateEffect } from 'ahooks';
import { useRef } from 'react';
import { tw } from 'twind';
import './action-handler';

import { useStore, useTrackedState } from './store';
import { useStore as useLoginModalStore } from '../LoginModal/store';
import { useUserLogin } from '../../api/hooks/useLogin';
import { useUserRegisterAPI } from '../../api/hooks/useRegister';
import type { UserRegisterFormSchema } from '../../model';
import { userRegisterFormSchema } from '../../model';

interface UserRegisterProps {}

export type FormSchema = UserRegisterFormSchema & {};

function UserRegisterModal(props: UserRegisterProps): JSX.Element {
  const { visible } = useTrackedState();
  const { setVisible } = useStore.getState();
  const [{ showSuccessfulAlert }, setStates] = useSetState({
    showSuccessfulAlert: false
  });
  const cacheUserRegisterForm = useRef<FormSchema>({
    username: '',
    password: ''
  });
  const { isLoading: userLoginLoading, mutateAsync: userLoginFetch } = useUserLogin({
    onSuccess(data, variables, context) {
      setVisible(false);
      useLoginModalStore.getState().setVisible(false);
    }
  });
  const quickLoggingIn = userLoginLoading;

  const { isLoading: userRegisterLoading, mutateAsync: userRegisterFetch } =
    useUserRegisterAPI({
      onSuccess: () => {
        setStates({ showSuccessfulAlert: true });
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
      setStates({ showSuccessfulAlert: false });
    }
  }, [visible]);

  return (
    <Modal
      opened={visible}
      centered={true}
      onClose={() => {
        if (quickLoggingIn) return;

        setVisible(false);
      }}
      closeOnClickOutside={false}
      title="用户注册"
      styles={() => (quickLoggingIn ? { close: { cursor: 'not-allowed' } } : {})}
    >
      <form onSubmit={form.onSubmit(formSubmit)}>
        <TextInput withAsterisk label="用户名" {...form.getInputProps('username')} />
        <PasswordInput withAsterisk label="密码" {...form.getInputProps('password')} />

        {userRegisterLoading ? null : quickLoggingIn ? (
          <Alert mt={20} color="green" icon={<Loader color="green" />}>
            正在登录中，
            <Anchor component="button" type="button" onClick={cancelQuickLogin}>
              点击此处
            </Anchor>
            取消快速登录
          </Alert>
        ) : (
          showSuccessfulAlert && (
            <Alert
              mt={20}
              color="green"
              icon={<MaterialSymbolsCheckCircleOutline fontSize={16} />}
            >
              注册成功，
              <Anchor component="button" type="button" onClick={quickLogin}>
                点击此处
              </Anchor>
              进行快速登录
            </Alert>
          )
        )}
        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => {
              if (!quickLoggingIn) backLogin();
            }}
            size="xs"
            className={tw`${quickLoggingIn ? 'cursor-not-allowed' : ''}`}
          >
            <Center inline>
              <IcoTwotoneKeyboardArrowLeft fontSize={12} />
              <Box ml={5}>回到登录</Box>
            </Center>
          </Anchor>
          <Button
            type="submit"
            color="gray"
            loading={userRegisterLoading}
            disabled={quickLoggingIn}
          >
            注册
          </Button>
        </Group>
      </form>
    </Modal>
  );

  async function formSubmit(values: FormSchema) {
    cacheUserRegisterForm.current = values;
    userRegisterFetch(values);
  }

  function quickLogin() {
    userLoginFetch(cacheUserRegisterForm.current);
  }

  function cancelQuickLogin() {
    // TODO: query cancel
  }

  function backLogin() {
    setVisible(false);
    useLoginModalStore.getState().setVisible(true);
  }
}

export default UserRegisterModal;
