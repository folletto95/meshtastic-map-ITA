-- Correct historical traceroute reply records to ensure they are displayed
-- as responses rather than outstanding requests.
UPDATE `traceroutes`
SET `want_response` = 0
WHERE `route_back` IS NOT NULL
  AND COALESCE(JSON_LENGTH(`route_back`), 0) > 0
  AND `want_response` <> 0;
