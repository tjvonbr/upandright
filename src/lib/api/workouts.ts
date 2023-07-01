import { Exercise, Workout } from "@prisma/client";

import { db } from "../prisma";

export async function getWorkout(workoutId: number) {
  const workout = await db.workout.findFirst({
    where: {
      id: Number(workoutId),
    },
    include: {
      exercises: true,
    },
  });

  return workout;
}

export async function addWorkoutExercise(
  workoutId: Workout["id"],
  exerciseId: Exercise["id"]
) {
  const workout = await db.workout.update({
    where: {
      id: Number(workoutId),
    },
    data: {
      exercises: {
        connect: {
          id: exerciseId,
        },
      },
    },
  });

  return workout;
}
