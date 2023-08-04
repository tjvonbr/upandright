"use client";

import "react-datepicker/dist/react-datepicker.css";

import { Program, Workout } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "next-auth";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import useSWRMutation from "swr/mutation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/app/components/common/dropdown";

import Spinner from "../../components/Spinner";
import { Button } from "./common/button";
import Input from "./common/Input";

interface WorkoutsOperationsProps {
  user: User;
  programs: Program[];
  workouts: Workout[];
}

export default function WorkoutsOperations({
  user,
  programs,
  workouts,
}: WorkoutsOperationsProps) {
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [program, setProgram] = useState<Program | null>(null);

  const router = useRouter();
  const { trigger, isMutating } = useSWRMutation(
    "http://localhost:3000/api/workouts",
    handleSubmit
  );

  function resetForm() {
    setName("");
    setDate(new Date());
    setProgram(null);
  }

  async function setTrigger() {
    await trigger();
  }

  async function handleSubmit(url: string) {
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          name,
          date,
          userId: Number(user.id),
          programId: program?.id,
        }),
      });

      if (response.ok) {
        router.refresh();
        resetForm();
      }
    } catch (error) {}
  }

  return (
    <div className="min-h-screen grid grid-cols-2">
      <div className="px-4 py-2 border-r border-slate-200 overflow-y-scroll">
        <h1 className="text-2xl font-bold">Workouts</h1>
        <div className="mt-3 space-y-2 flex flex-col">
          {workouts.map((workout: Workout, idx: number) => (
            <WorkoutItem
              key={idx}
              href={`/workouts/${workout.id}`}
              workout={workout}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <form
          className="w-[50%] space-y-2"
          action="submit"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            setTrigger();
          }}
        >
          <div>
            <h2 className="text-2xl font-bold">Add a workout</h2>
            <p className="text-slate-500">
              If you don&apos;t see a workout that you want to track in the
              column on the left, you can add it below.
            </p>
          </div>
          <fieldset className="w-full flex flex-col">
            <label className="text-sm font-semibold" htmlFor="name">
              Name
            </label>
            <Input
              className="h-8 w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
          </fieldset>
          <fieldset className="w-full flex flex-col">
            <label className="text-sm font-semibold" htmlFor="date">
              Workout date
            </label>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              className="h-8 p-2 text-sm border border-gray-200 rounded-md"
            />
          </fieldset>
          <div>
            <label className="text-sm font-semibold">Program</label>
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-full px-2 flex items-center justify-center bg-white text-black rounded-md border border-gray-200 hover:bg-muted">
                <ChevronDown size={15} strokeWidth={2.5} />
                <div className="px-2 text-sm">
                  {program?.name ?? "No program selected"}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {programs.map((program: Program, idx: number) => (
                  <DropdownMenuRadioItem
                    className="rounded-md data-[highlighted]:bg-gray-300"
                    key={idx}
                    value={program.name}
                    // eslint-disable-next-line no-unused-vars
                    onSelect={(_: Event) => {
                      setProgram(program);
                    }}
                  >
                    {program.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button variant="primary" className="w-full">
            {isMutating ? <Spinner /> : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
}

interface WorkoutItemProps {
  href: string;
  workout: Workout;
}

function WorkoutItem({ href, workout }: WorkoutItemProps) {
  const router = useRouter();

  return (
    <div
      className="px-3 py-2 flex justify-between items-center bg-white rounded-md border border-slate-200 hover:cursor-pointer"
      onClick={() => router.push(href)}
    >
      <span className="font-semibold text-sm">{workout.name}</span>
    </div>
  );
}
