UPDATE "TodoList" SET "todosOrder" = "UpdatedOrder"."newTodoOrder"
FROM (
    SELECT DoingTodos."todoListId", jsonb_agg(DoingTodos."todoId") AS "newTodoOrder" FROM (
        SELECT TL.id as "todoListId", TRIM('"' FROM "todoOrderId"::text) AS "todoId"
        FROM "TodoList" TL, jsonb_array_elements(TL."todosOrder") WITH ORDINALITY arr("todoOrderId", position)
        WHERE TRIM('"'FROM "todoOrderId"::text)::uuid IN (
            SELECT id FROM "Todo" WHERE "isComplete" = false
        )
        ORDER BY "todoListId", position
    ) as DoingTodos
    GROUP BY DoingTodos."todoListId"
) AS "UpdatedOrder"
WHERE "TodoList".id = "UpdatedOrder"."todoListId";