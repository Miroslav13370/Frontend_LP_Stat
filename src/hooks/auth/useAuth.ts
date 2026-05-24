import { useLoginMutation, useRegisterMutation } from "@/src/api/auth/apiAuth";
import { IAuthType } from "@/src/api/auth/apiAuth.type";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useAuth = () => {
  const [loginMutate] = useLoginMutation();
  const [registerMutate] = useRegisterMutation();

  const router = useRouter();

  const authMutate = async (data: IAuthType, isLogin: boolean) => {
    try {
      if (isLogin) {
        await loginMutate(data).unwrap();
      } else {
        await registerMutate(data).unwrap();
      }
      toast.success("Успешная авторизация");
      router.replace("/moderator");
      router.refresh();
    } catch {
      toast.error("При авторизации произошла ошибка");
    }
  };

  return { authMutate };
};
