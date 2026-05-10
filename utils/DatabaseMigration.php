<?php
/**
 * utils/DatabaseMigration.php - Professional Database Migration Tool
 */

class DatabaseMigration {
    private $db;
    private $migrationsPath;

    public function __construct($db, $migrationsPath = __DIR__ . '/../migrations') {
        $this->db = $db;
        $this->migrationsPath = $migrationsPath;
        $this->createMigrationsTable();
    }

    /**
     * Create migrations tracking table
     */
    private function createMigrationsTable() {
        $sql = "CREATE TABLE IF NOT EXISTS migrations (
                id INT PRIMARY KEY AUTO_INCREMENT,
                migration VARCHAR(255) UNIQUE NOT NULL,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )";
        
        $this->db->query($sql);
    }

    /**
     * Run all pending migrations
     */
    public function runPendingMigrations() {
        $migrations = $this->getPendingMigrations();
        
        foreach ($migrations as $migration) {
            echo "Running migration: {$migration}\n";
            
            try {
                $this->runMigration($migration);
                $this->recordMigration($migration);
                echo "✓ Migration completed: {$migration}\n";
            } catch (Exception $e) {
                echo "✗ Migration failed: {$migration}\n";
                echo "Error: " . $e->getMessage() . "\n";
            }
        }
    }

    /**
     * Get pending migrations
     */
    private function getPendingMigrations() {
        $executedMigrations = [];
        $result = $this->db->query("SELECT migration FROM migrations");
        
        while ($row = $result->fetch_assoc()) {
            $executedMigrations[] = $row['migration'];
        }

        $allMigrations = glob($this->migrationsPath . '/*.sql');
        $pending = [];

        foreach ($allMigrations as $file) {
            $filename = basename($file);
            if (!in_array($filename, $executedMigrations)) {
                $pending[] = $filename;
            }
        }

        return $pending;
    }

    /**
     * Run specific migration
     */
    private function runMigration($migrationFile) {
        $filepath = $this->migrationsPath . '/' . $migrationFile;
        
        if (!file_exists($filepath)) {
            throw new Exception("Migration file not found: {$filepath}");
        }

        $sql = file_get_contents($filepath);
        
        if (!$this->db->multi_query($sql)) {
            throw new Exception("SQL Error: " . $this->db->error);
        }

        // Clear all results
        while ($this->db->more_results()) {
            $this->db->next_result();
        }
    }

    /**
     * Record migration
     */
    private function recordMigration($migration) {
        $stmt = $this->db->prepare("INSERT INTO migrations (migration) VALUES (?)");
        $stmt->bind_param('s', $migration);
        $stmt->execute();
    }

    /**
     * Rollback last migration
     */
    public function rollback() {
        $result = $this->db->query("SELECT migration FROM migrations ORDER BY executed_at DESC LIMIT 1");
        $row = $result->fetch_assoc();
        
        if (!$row) {
            echo "No migrations to rollback\n";
            return;
        }

        $migration = $row['migration'];
        $rollbackFile = str_replace('.sql', '.rollback.sql', $migration);
        $filepath = $this->migrationsPath . '/' . $rollbackFile;

        if (!file_exists($filepath)) {
            echo "No rollback file found for: {$migration}\n";
            return;
        }

        try {
            $this->runMigration($rollbackFile);
            $this->db->query("DELETE FROM migrations WHERE migration = '{$migration}'");
            echo "✓ Rollback completed: {$migration}\n";
        } catch (Exception $e) {
            echo "✗ Rollback failed: {$migration}\n";
            echo "Error: " . $e->getMessage() . "\n";
        }
    }

    /**
     * Show migration status
     */
    public function status() {
        echo "\n=== Migration Status ===\n";
        
        $executed = [];
        $result = $this->db->query("SELECT migration FROM migrations ORDER BY executed_at");
        
        while ($row = $result->fetch_assoc()) {
            $executed[] = $row['migration'];
        }

        if (empty($executed)) {
            echo "No migrations executed yet\n";
        } else {
            echo "Executed Migrations:\n";
            foreach ($executed as $migration) {
                echo "  ✓ {$migration}\n";
            }
        }

        $pending = $this->getPendingMigrations();
        if (empty($pending)) {
            echo "\nNo pending migrations\n";
        } else {
            echo "\nPending Migrations:\n";
            foreach ($pending as $migration) {
                echo "  ⟳ {$migration}\n";
            }
        }
    }
}

// CLI Interface
if (php_sapi_name() === 'cli') {
    require_once 'config.php';
    
    $conn = getDBConnection();
    $migration = new DatabaseMigration($conn);

    $command = $argv[1] ?? 'status';

    switch ($command) {
        case 'migrate':
            $migration->runPendingMigrations();
            break;
        case 'rollback':
            $migration->rollback();
            break;
        case 'status':
            $migration->status();
            break;
        default:
            echo "Unknown command: {$command}\n";
            echo "Available commands: migrate, rollback, status\n";
    }

    $conn->close();
}
?>
