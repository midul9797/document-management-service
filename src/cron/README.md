# Cron Jobs

This directory contains scheduled tasks (cron jobs) for the document management system.

## Available Cron Jobs

### Recycle Bin Cleanup (`recycleBinCleanup.ts`)

**Purpose**: Automatically removes documents from the recycle bin that have been deleted for more than 30 days.

**Schedule**: Runs every day at midnight (00:00 UTC)

**What it does**:

- Finds all documents marked as deleted (`deleted: true`)
- Checks if they were deleted more than 30 days ago
- Permanently removes them from the database

## Usage

### Starting Cron Jobs

To start all cron jobs when your application starts:

```typescript
import { startCronJobs } from './src/cron';

// Start all cron jobs
startCronJobs();
```

### Stopping Cron Jobs

To stop all cron jobs:

```typescript
import { stopCronJobs } from './src/cron';

// Stop all cron jobs
stopCronJobs();
```

### Manual Execution

To run the recycle bin cleanup manually (for testing):

```typescript
import { runCleanupNow } from './src/cron';

// Run cleanup immediately
runCleanupNow();
```

### Individual Job Management

You can also manage individual cron jobs:

```typescript
import {
  startRecycleBinCleanup,
  stopRecycleBinCleanup,
  runRecycleBinCleanupNow,
} from './src/cron/recycleBinCleanup';

// Start only recycle bin cleanup
startRecycleBinCleanup();

// Stop only recycle bin cleanup
stopRecycleBinCleanup();

// Run recycle bin cleanup immediately
runRecycleBinCleanupNow();
```

## Integration with Server

To integrate cron jobs with your Express server, add this to your `server.ts` or `app.ts`:

```typescript
import { startCronJobs } from './cron';

// Start cron jobs when server starts
startCronJobs();
```

## Configuration

### Cron Schedule Format

The cron schedule uses the standard cron format: `minute hour day month day-of-week`

- `"0 0 * * *"` - Every day at midnight
- `"0 */6 * * *"` - Every 6 hours
- `"0 0 * * 0"` - Every Sunday at midnight

### Timezone

All cron jobs use UTC timezone by default. You can change this in the individual cron job files.

## Adding New Cron Jobs

1. Create a new file in the `src/cron/` directory
2. Follow the pattern from `recycleBinCleanup.ts`
3. Export the job and management functions
4. Add the imports and exports to `index.ts`
5. Update this README

## Testing

To test cron jobs without waiting for the scheduled time:

```typescript
import { runCleanupNow } from './src/cron';

// This will run the cleanup immediately
runCleanupNow();
```

## Logs

Cron jobs log their activities to the console:

- 🗑️ When cleanup starts
- ✅ When cleanup completes successfully
- ❌ When errors occur
- 🔄 When jobs start/stop
