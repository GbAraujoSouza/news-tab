import database from "@/infra/database.js";
import { version } from "react";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const versionQueryResult = await database.query("SHOW server_version;");
  const version = versionQueryResult.rows[0].server_version;

  const maxConnectionsQueryResult = await database.query(
    "SHOW max_connections;",
  );
  const maxConnections = maxConnectionsQueryResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const usedConnectionsQueryResult = await database.query({
    text: `SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;`,
    values: [databaseName],
  });
  const openedConnections = usedConnectionsQueryResult.rows[0].count;
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version,
        max_connections: parseInt(maxConnections),
        opened_connections: openedConnections,
      },
    },
  });
}

export default status;
