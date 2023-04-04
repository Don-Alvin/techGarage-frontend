import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const taskAdapter = createEntityAdapter({
	sortComparer: (a, b) =>
		a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = taskAdapter.getInitialState();

export const tasksApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getTasks: builder.query({
			query: () => ({
				url: "/tasks",
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData) => {
				const loadedTask = responseData.map((task) => {
					task.id = task._id;
					return task;
				});
				return taskAdapter.setAll(initialState, loadedTask);
			},
			providesTags: (result, error, arg) => {
				if (result?.ids) {
					return [
						{ type: "Task", id: "LIST" },
						...result.ids.map((id) => ({ type: "Task", id })),
					];
				} else return [{ type: "Task", id: "LIST" }];
			},
		}),

		addNewTask: builder.mutation({
			query: (initialTaskData) => ({
				url: "/tasks",
				method: "POST",
				body: {
					...initialTaskData,
				},
			}),
			invalidatesTags: [{ type: "Task", id: "LIST" }],
		}),
		updateTask: builder.mutation({
			query: (initialTaskData) => ({
				url: "/tasks",
				method: "PATCH",
				body: {
					...initialTaskData,
				},
			}),
			invalidatesTags: (result, error, arg) => [{ type: "Task", id: arg.id }],
		}),
		deleteTask: builder.mutation({
			query: ({ id }) => ({
				url: "/tasks",
				method: "DELETE",
				body: { id },
			}),
			invalidatesTags: (result, error, arg) => [{ type: "Task", id: arg.id }],
		}),
	}),
});

export const {
	useGetTasksQuery,
	useAddNewTaskMutation,
	useUpdateTaskMutation,
	useDeleteTaskMutation,
} = tasksApiSlice;

// returns the query result object
export const selectTaskResult = tasksApiSlice.endpoints.getTasks.select();

// creates memoized selector
const selectTaskData = createSelector(
	selectTaskResult,
	(taskResult) => taskResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
	selectAll: selectAllTask,
	selectById: selectTaskById,
	selectIds: selectTaskIds,
	// Pass in a selector that returns the task slice of state
} = taskAdapter.getSelectors((state) => selectTaskData(state) ?? initialState);
