import {
  BookingForm,
  BookingCreateRequest,
  BookingResponse,
  PackageQuantities
} from "@/types/booking";

const BASE_URL = "http://localhost:8080/api/bookings";

export const BookingAPI = {
    createWithPayment: async (
        params: BookingCreateRequest
    ): Promise<BookingResponse> => {

        const formData = new FormData();

        const {
        form,
        appointmentId,
        numberOfPersons,
        paymentMethod,
        packageQuantities,
        isGroupBooking,
        groupName
        } = params;


        formData.append("firstname", form.firstName);
        formData.append("lastname", form.lastName);

        if (form.birthdate) {
        formData.append("birthdate", form.birthdate);
        }

        formData.append("email", form.email);

        if (form.phone) {
        formData.append("phone", form.phone);
        }

        formData.append("street", form.street);
        formData.append("houseNumber", form.houseNumber);
        formData.append("postalCode", form.postalCode);
        formData.append("city", form.city);

        if (form.country) {
        formData.append("country", form.country);
        }

        formData.append("appointmentId", String(appointmentId));
        formData.append("paymentMethod", paymentMethod);
        formData.append("numberOfPersons", String(numberOfPersons));

        if (isGroupBooking) {
        formData.append("isGroupBooking", "true");
        if (groupName) {
            formData.append("groupName", groupName);
        }
        }

        if (packageQuantities && Object.keys(packageQuantities).length > 0) {
        formData.append(
            "packageQuantitiesJson",
            JSON.stringify(packageQuantities)
        );
        }

        console.log("Sending booking data:", {
            firstname: form.firstName,
            lastname: form.lastName,
            birthdate: form.birthdate,
            email: form.email,
            phone: form.phone,
            street: form.street,
            houseNumber: form.houseNumber,
            postalCode: form.postalCode,
            city: form.city,
            country: form.country,
            appointmentId,
            paymentMethod,
            numberOfPersons,
            packageQuantities,
            isGroupBooking,
            groupName,
        });

        const res = await fetch(`${BASE_URL}/createWithPayment`, {
        method: "POST",
        body: formData,
        });

        let data;
        try {
            data = await res.json();
        } catch (error) {
            console.error("Failed to parse API response as JSON:", error);
            throw new Error("Invalid API response format");
        }

        console.log("API Response:", data);

        if (!res.ok) {
        console.error("API Error Response:", data);
        throw new Error(data.message || "Booking failed");
        }

        return data;
    },
};