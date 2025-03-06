import { userSchema } from "@/lib/model/dto/edit-user.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import useServiceContext from "../use-service-context";
import { User } from "@/lib/model/entity/user";
import { useNavigate } from "react-router";
import { serializeImage } from "@/lib/utils/Image";
import { useGetAuthenticated } from "./use-get-authenticated";
import { toast } from "sonner";

export function useEditProfile() {

  const { userService } = useServiceContext();
  const { me, fetch } = useGetAuthenticated();
  const [user, setUser] = useState<User | null>(null);

  const form = useForm<z.infer<typeof userSchema>>({
      resolver: zodResolver(userSchema),
      defaultValues: {
          username: "",
          dob: "",
          nationality: "",
          gender: "Other",
          email: "",
          image: undefined,
      },
  });

  const fetchUser = async () => {
    await userService.me().then(user => {
      setUser(user);
      if (user) {
        form.setValue('username', user.username || '');
        form.setValue('dob', user.dob || '');
        form.setValue('nationality', user.nationality || '');
        form.setValue(
          'gender',
          (user.gender as 'Male' | 'Female' | 'Other') || 'Other',
        );
        form.setValue('email', user.email || '');
      }
    });
  }

  const handleFetch = async () => {
    toast.promise(fetchUser(), {
      loading: 'Loading...',
      success: 'User fetched successfully',
      error: 'Failed to fetch user',
    });
  }

  useEffect(() => {
    if (me == null) return;
    handleFetch();
  }, [me]);

  const edit = async (a: [] | [Float64Array]) => {
    const userValues = form.getValues();
    await userService.editUser({
        ...userValues,
        internetIdentity: user!.internetIdentity!,
        balance: user!.balance,
        profilePicture: userValues.image
          ? await serializeImage(userValues.image) : [],
        faceEncoding: a,
        role: user!.role
    })
  }

  return { userForm: form, handleEdit: edit };
}