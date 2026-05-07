// utils/deepSetFormValues.ts
import { UseFormReturn, FieldValues, Path, PathValue } from "react-hook-form";

/**
 * Options for setting form values
 */
export interface DeepSetOptions {
  /**
   * Whether to merge with existing values or completely replace
   * @default false (complete replacement)
   */
  merge?: boolean;

  /**
   * Whether to trigger validation after setting values
   * @default false
   */
  shouldValidate?: boolean;

  /**
   * Whether to preserve dirty state
   * @default false
   */
  keepDirty?: boolean;

  /**
   * Whether to preserve touched state
   * @default false
   */
  keepTouched?: boolean;
}

/**
 * Deep clone an object or array
 */
function deepClone<T>(value: T): T {
  if (value === null || value === undefined) return value;
  if (typeof value !== "object") return value;

  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item)) as T;
  }

  const cloned: Record<string, unknown> = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      cloned[key] = deepClone(value[key]);
    }
  }
  return cloned as T;
}

/**
 * Check if a value is a plain object (not array, not null, not Date, etc.)
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return false;
  if (typeof value !== "object") return false;
  if (value instanceof Date) return false;
  if (value instanceof RegExp) return false;
  return true;
}

/**
 * Recursively set values in react-hook-form
 *
 * @param formContext - react-hook-form context
 * @param data - Data to set in the form
 * @param parentPath - Current path (used for recursion)
 * @param options - Configuration options
 *
 * @example
 * deepSetFormValues(formContext, {
 *   title: "Hello",
 *   variations: [{ price: 100, color: "red" }]
 * });
 */
export function deepSetFormValues<T extends FieldValues>(
  formContext: UseFormReturn<T>,
  data: unknown,
  parentPath: string = "",
  options: DeepSetOptions = {},
): void {
  const {
    merge = false,
    shouldValidate = false,
    keepDirty = false,
    keepTouched = false,
  } = options;

  const setValueOptions = {
    shouldValidate,
    shouldDirty: !keepDirty,
    shouldTouch: !keepTouched,
  };

  // Handle null or undefined values
  if (data === null || data === undefined) {
    if (parentPath) {
      formContext.setValue(
        parentPath as Path<T>,
        data as PathValue<T, Path<T>>,
        setValueOptions,
      );
    }
    return;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    if (parentPath) {
      // Set the entire array with cloned values
      const newArray = data.map((item) => deepClone(item));
      formContext.setValue(
        parentPath as Path<T>,
        newArray as PathValue<T, Path<T>>,
        setValueOptions,
      );

      // Recurse into each array item
      data.forEach((item: unknown, index: number) => {
        if (isPlainObject(item)) {
          deepSetFormValues(
            formContext,
            item,
            `${parentPath}.${index}`,
            options,
          );
        }
      });
    }
    return;
  }

  // Handle plain objects
  if (isPlainObject(data)) {
    const obj = data as Record<string, unknown>;

    // Set the entire object if we have a parent path
    if (parentPath && merge) {
      const currentValue = formContext.getValues(parentPath as Path<T>);
      if (isPlainObject(currentValue)) {
        // Perform merge operation
        const merged = { ...currentValue, ...obj };
        formContext.setValue(
          parentPath as Path<T>,
          merged as PathValue<T, Path<T>>,
          setValueOptions,
        );
      } else {
        // Replace with clean object if current value is not an object
        const cleanObject = deepClone(obj);
        formContext.setValue(
          parentPath as Path<T>,
          cleanObject as PathValue<T, Path<T>>,
          setValueOptions,
        );
      }
    } else if (parentPath) {
      // Set the entire clean object
      const cleanObject = deepClone(obj);
      formContext.setValue(
        parentPath as Path<T>,
        cleanObject as PathValue<T, Path<T>>,
        setValueOptions,
      );
    }

    // Recurse into all object keys
    Object.keys(obj).forEach((key) => {
      const newPath = parentPath ? `${parentPath}.${key}` : key;
      const value = obj[key];

      if (Array.isArray(value)) {
        // Handle arrays
        const cleanArray = value.map((item) => deepClone(item));
        formContext.setValue(
          newPath as Path<T>,
          cleanArray as PathValue<T, Path<T>>,
          setValueOptions,
        );

        // Recurse into array items
        value.forEach((item: unknown, index: number) => {
          if (isPlainObject(item)) {
            deepSetFormValues(
              formContext,
              item,
              `${newPath}.${index}`,
              options,
            );
          }
        });
      } else if (isPlainObject(value)) {
        // Handle nested objects
        deepSetFormValues(formContext, value, newPath, options);
      } else {
        // Handle primitive values
        formContext.setValue(
          newPath as Path<T>,
          value as PathValue<T, Path<T>>,
          setValueOptions,
        );
      }
    });
    return;
  }

  // Handle primitive values (string, number, boolean, etc.)
  if (parentPath) {
    formContext.setValue(
      parentPath as Path<T>,
      data as PathValue<T, Path<T>>,
      setValueOptions,
    );
  }
}

/**
 * Safely set form values with high reliability
 * First attempts to use reset(), falls back to deepSetFormValues if reset fails
 *
 * @param formContext - react-hook-form context
 * @param data - Data to set in the form
 * @param options - Configuration options
 *
 * @example
 * await safeSetFormValues(formContext, sampleData);
 */
export async function safeSetFormValues<T extends FieldValues>(
  formContext: UseFormReturn<T>,
  data: T | Partial<T> | unknown,
  options: DeepSetOptions = {},
): Promise<void> {
  const { merge = false, shouldValidate = false } = options;

  try {
    // Deep clone the data to avoid shared references
    const cleanData = deepClone(data);

    // If merge mode is enabled, regular reset won't work
    if (merge) {
      throw new Error("Merge mode requires deepSetFormValues");
    }

    // Method 1: Use reset (best and fastest method)
    formContext.reset(cleanData as T);

    // Trigger validation if requested
    if (shouldValidate) {
      await formContext.trigger();
    }
  } catch (error) {
    // Method 2: Fall back to recursive setValue
    console.warn("Reset failed, using deepSetFormValues:", error);
    deepSetFormValues(formContext, data, "", options);

    // Trigger validation if requested
    if (shouldValidate) {
      await formContext.trigger();
    }
  }
}

/**
 * Set a specific field value with support for nested paths (e.g., variations.0.price)
 *
 * @param formContext - react-hook-form context
 * @param path - Field path (e.g., "variations.0.price")
 * @param value - New value to set
 * @param options - Configuration options
 *
 * @example
 * setFieldValue(formContext, "variations.0.price", 100);
 * setFieldValue(formContext, "variations", [{ price: 100 }]);
 */
export function setFieldValue<T extends FieldValues>(
  formContext: UseFormReturn<T>,
  path: string,
  value: unknown,
  options: {
    shouldValidate?: boolean;
    shouldDirty?: boolean;
    shouldTouch?: boolean;
  } = {},
): void {
  const {
    shouldValidate = false,
    shouldDirty = true,
    shouldTouch = true,
  } = options;

  // Handle array index paths where the value is an array
  if (path.match(/\.\d+$/) && Array.isArray(value)) {
    // Extract parent path
    const parentPath = path.replace(/\.\d+$/, "") as Path<T>;
    const currentArray = formContext.getValues(parentPath) as unknown[];

    if (Array.isArray(currentArray)) {
      const index = parseInt(path.match(/\d+$/)![0]);
      const newArray = [...currentArray];
      newArray[index] = value;
      formContext.setValue(parentPath, newArray as PathValue<T, Path<T>>, {
        shouldValidate,
        shouldDirty,
        shouldTouch,
      });
      return;
    }
  }

  // Direct set
  formContext.setValue(path as Path<T>, value as PathValue<T, Path<T>>, {
    shouldValidate,
    shouldDirty,
    shouldTouch,
  });
}

/**
 * Get a field value with support for nested paths
 *
 * @param formContext - react-hook-form context
 * @param path - Field path (e.g., "variations.0.price")
 * @returns The field value
 *
 * @example
 * const price = getFieldValue(formContext, "variations.0.price");
 */
export function getFieldValue<T extends FieldValues>(
  formContext: UseFormReturn<T>,
  path: string,
): unknown {
  const parts = path.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = formContext.getValues();

  for (const part of parts) {
    if (value === null || value === undefined) return undefined;
    value = value[part];
  }

  return value;
}
