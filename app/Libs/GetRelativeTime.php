<?php

namespace App\Libs;

use Carbon\Carbon;

class GetRelativeTime
{
    public function getRelativeTime(string $relativeTime, ?int $dayOffset, string $unit = 'days'): ?string
    {
        return match ($relativeTime) {
            'Today' => $this->getToday($dayOffset, $unit),
            'A Week Ago' => $this->getWeekAgo($dayOffset, $unit),
            'A Month Ago' => $this->getMonthAgo($dayOffset, $unit),
            'A Year Ago' => $this->getYearAgo($dayOffset, $unit),
            'This Week' => $this->ThisWeek($dayOffset, $unit),
            'This Month' => $this->ThisMonth($dayOffset, $unit),
            'This Year' => $this->ThisYear($dayOffset, $unit),
            default => null
        };
    }

    private function getToday(?int $dayOffset, string $unit): string
    {
        $now = now();

        if ($dayOffset != null && $dayOffset > 0) {
            $this->performAddition($now, $dayOffset, $unit);
        }
        if ($dayOffset != null && $dayOffset < 0) {
            $this->performSubtraction($now, $dayOffset, $unit);
        }

        return $now->toDateString();
    }

    private function getWeekAgo(?int $dayOffset, string $unit): string
    {
        $weekAgo = now()->subWeek();

        if ($dayOffset != null && $dayOffset > 0) {
            $this->performAddition($weekAgo, $dayOffset, $unit);
        }
        if ($dayOffset != null && $dayOffset < 0) {
            $this->performSubtraction($weekAgo, $dayOffset, $unit);
        }

        return $weekAgo->toDateString();
    }

    private function getMonthAgo(?int $dayOffset, string $unit): string
    {
        $monthAgo = now()->subMonth();

        if ($dayOffset != null && $dayOffset > 0) {
            $this->performAddition($monthAgo, $dayOffset, $unit);
        }
        if ($dayOffset != null && $dayOffset < 0) {
            $this->performSubtraction($monthAgo, $dayOffset, $unit);
        }

        return $monthAgo->toDateString();
    }

    private function getYearAgo(?int $dayOffset, string $unit): string
    {
        $yearAgo = now()->subYear();

        if ($dayOffset != null && $dayOffset > 0) {
            $this->performAddition($yearAgo, $dayOffset, $unit);
        }
        if ($dayOffset != null && $dayOffset < 0) {
            $this->performSubtraction($yearAgo, $dayOffset, $unit);
        }

        return $yearAgo->toDateString();
    }

    private function ThisWeek(?int $dayOffset, string $unit): string
    {
        $thisWeek = now()->startOfWeek();

        if ($dayOffset != null && $dayOffset > 0) {
            $this->performAddition($thisWeek, $dayOffset, $unit);
        }
        if ($dayOffset != null && $dayOffset < 0) {
            $this->performSubtraction($thisWeek, $dayOffset, $unit);
        }

        return $thisWeek->toDateString();
    }

    private function ThisMonth(?int $dayOffset, string $unit): string
    {
        $thisMonth = now()->startOfMonth();

        if ($dayOffset != null && $dayOffset > 0) {
            $this->performAddition($thisMonth, $dayOffset, $unit);
        }
        if ($dayOffset != null && $dayOffset < 0) {
            $this->performSubtraction($thisMonth, $dayOffset, $unit);
        }

        return $thisMonth->toDateString();
    }

    private function ThisYear(?int $dayOffset, string $unit): string
    {
        $thisYear = now()->startOfYear();

        if ($dayOffset != null && $dayOffset > 0) {
            $this->performAddition($thisYear, $dayOffset, $unit);
        }
        if ($dayOffset != null && $dayOffset < 0) {
            $this->performSubtraction($thisYear, $dayOffset, $unit);
        }

        return $thisYear->toDateString();
    }

    private function performAddition(Carbon $date, int $offset, string $unit): void
    {
        match ($unit) {
            'days' => $date->addDays($offset),
            'weeks' => $date->addWeeks($offset),
            'months' => $date->addMonths($offset),
            'years' => $date->addYears($offset),
            default => $date
        };
    }

    private function performSubtraction(Carbon $date, int $offset, string $unit): void
    {
        match ($unit) {
            'days' => $date->subDays(abs($offset)),
            'weeks' => $date->subWeeks(abs($offset)),
            'months' => $date->subMonths(abs($offset)),
            'years' => $date->subYears(abs($offset)),
            default => $date
        };
    }
}
