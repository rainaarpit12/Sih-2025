-- Insert test data for distributor
INSERT INTO distributor_info (product_id, distributor_name, distributor_location, transport_conditions, distributor_price, distribution_date) 
VALUES ('PRD001', 'ABC Distributors', 'Delhi', 'Refrigerated', '50.00', '2025-09-21');

INSERT INTO distributor_info (product_id, distributor_name, distributor_location, transport_conditions, distributor_price, distribution_date) 
VALUES ('PRD002', 'XYZ Logistics', 'Mumbai', 'Ambient', '75.00', '2025-09-21');

-- Check the data
SELECT * FROM distributor_info;