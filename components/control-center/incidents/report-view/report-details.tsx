'use client';

import React, { useState } from 'react';

interface FormData {
  id: string;
  reported_by: string;
  incident_type_id: string;
  location: string;
  location_description: string;
  severity: string;
  description: string;
  status: string;
  incident_time: string;
  created_at: string;
  updated_at: string;
}

export default function ReportDetails() {
  const [formData, setFormData] = useState<FormData>({
    id: '',
    reported_by: '',
    incident_type_id: '',
    location: '',
    location_description: '',
    severity: '',
    description: '',
    status: '',
    incident_time: '',
    created_at: '',
    updated_at: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // TODO: change to report id fetching from database
  const reportID = 777777;
  const listStyle = 'bg-white text-gray-900 dark:bg-gray-800 dark:text-white';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Handle form submission here
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Report Details (#{reportID})</h1>

      {/* ID (read-only or hidden) */}
      <div className="hidden">
        <input type="hidden" name="id" value={formData.id} />
      </div>

      {/* Reported By */}
      <div>
        <label htmlFor="reported_by" className="block text-sm font-medium mb-2">
          Reported By:
        </label>
        <input
          type="text"
          id="reported_by"
          name="reported_by"
          value={formData.reported_by}
          onChange={handleChange}
          placeholder="Enter reporter Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* TODO: add additional incident types as necessary */}
      {/* Incident Type */}
      <div>
        <label
          htmlFor="incident_type_id"
          className="block text-sm font-medium mb-2"
        >
          Incident Type
        </label>
        <select
          id="incident_type_id"
          name="incident_type_id"
          value={formData.incident_type_id}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
          required
        >
          <option value="" className={listStyle}>
            Select Incident Type
          </option>
          <option value="vehicleAccident" className={listStyle}>
            Vehicular Accident
          </option>
          <option value="flooding" className={listStyle}>
            Flooding
          </option>
          <option value="fire" className={listStyle}>
            Fire
          </option>
          <option value="other" className={listStyle}>
            Other
          </option>
        </select>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium mb-2">
          Location (Point, 4326)
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Geographic Coordinates"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled
        />
      </div>

      {/* Location Description */}
      <div>
        <label
          htmlFor="location_description"
          className="block text-sm font-medium mb-2"
        >
          Location Description
        </label>
        <textarea
          id="location_description"
          name="location_description"
          value={formData.location_description}
          onChange={handleChange}
          placeholder="Describe the location in detail"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Severity */}
      <div>
        <label htmlFor="severity" className="block text-sm font-medium mb-2">
          Severity
        </label>
        <select
          id="severity"
          name="severity"
          value={formData.severity}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
          required
        >
          <option value="" className={listStyle}>
            Select severity level
          </option>
          <option value="low" className={listStyle}>
            Low
          </option>
          <option value="medium" className={listStyle}>
            Medium
          </option>
          <option value="high" className={listStyle}>
            High
          </option>
          <option value="critical" className={listStyle}>
            Critical
          </option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide a detailed description of the incident"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-2">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Incident Time */}
      <div>
        <label
          htmlFor="incident_time"
          className="block text-sm font-medium mb-2"
        >
          Incident Time
        </label>
        <input
          type="datetime-local"
          id="incident_time"
          name="incident_time"
          value={formData.incident_time}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Created At (read-only) */}
      <div>
        <label htmlFor="created_at" className="block text-sm font-medium mb-2">
          Created At
        </label>
        <input
          type="datetime-local"
          id="created_at"
          name="created_at"
          value={formData.created_at}
          onChange={handleChange}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
        />
      </div>

      {/* Updated At (read-only) */}
      <div>
        <label htmlFor="updated_at" className="block text-sm font-medium mb-2">
          Updated At
        </label>
        <input
          type="datetime-local"
          id="updated_at"
          name="updated_at"
          value={formData.updated_at}
          onChange={handleChange}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
        />
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Resolve
        </button>
        <button
          type="reset"
          onClick={() =>
            setFormData({
              id: '',
              reported_by: '',
              incident_type_id: '',
              location: '',
              location_description: '',
              severity: '',
              description: '',
              status: '',
              incident_time: '',
              created_at: '',
              updated_at: '',
            })
          }
          className="px-6 py-2 bg-gray-300 text-gray-800 font-medium rounded-md hover:bg-gray-400 transition-colors"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
