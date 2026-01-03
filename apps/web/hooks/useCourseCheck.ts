import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api";

export function useCourseCheck() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ["user", "courses"],
    queryFn: async () => {
      const response = await usersApi.getEnrolledCourses();
      return response.data;
    },
  });

  return {
    hasCourses: (courses?.length ?? 0) > 0,
    courseCount: courses?.length ?? 0,
    isLoading,
  };
}
